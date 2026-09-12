defmodule Elixirphoenix.ItemStore do
  use Agent

  def start_link(_opts) do
    Agent.start_link(
      fn ->
        %{
          1 => %{id: 1, name: "Keyboard", price: 500_000},
          2 => %{id: 2, name: "Mouse", price: 250_000}
        }
      end,
      name: __MODULE__
    )
  end

  def all do
    Agent.get(__MODULE__, fn items ->
      Map.values(items)
    end)
  end

  def get(id) do
    Agent.get(__MODULE__, fn items ->
      Map.get(items, id)
    end)
  end

  def create(name, price) do
    Agent.get_and_update(__MODULE__, fn items ->
      id =
        case Map.keys(items) do
          [] -> 1
          keys -> Enum.max(keys) + 1
        end

      item = %{
        id: id,
        name: name,
        price: price
      }

      {item, Map.put(items, id, item)}
    end)
  end

  def update(id, name, price) do
    Agent.get_and_update(__MODULE__, fn items ->
      case Map.get(items, id) do
        nil ->
          {nil, items}

        item ->
          updated = %{item | name: name, price: price}

          {updated, Map.put(items, id, updated)}
      end
    end)
  end

  def delete(id) do
    Agent.get_and_update(__MODULE__, fn items ->
      case Map.pop(items, id) do
        {nil, _items} ->
          {nil, items}

        {item, items} ->
          {item, items}
      end
    end)
  end
end