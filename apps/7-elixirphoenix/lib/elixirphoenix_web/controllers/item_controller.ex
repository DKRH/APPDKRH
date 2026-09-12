defmodule ElixirphoenixWeb.ItemController do
  use ElixirphoenixWeb, :controller

  alias Elixirphoenix.ItemStore

  def index(conn, _params) do
    json(conn, ItemStore.all())
  end

  def show(conn, %{"id" => id}) do
    case ItemStore.get(String.to_integer(id)) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Item not found"})

      item ->
        json(conn, item)
    end
  end

  def create(conn, %{"name" => name, "price" => price}) do
    item = ItemStore.create(name, price)

    conn
    |> put_status(:created)
    |> json(item)
  end

  def update(conn, %{"id" => id, "name" => name, "price" => price}) do
    case ItemStore.update(String.to_integer(id), name, price) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Item not found"})

      item ->
        json(conn, item)
    end
  end

  def delete(conn, %{"id" => id}) do
    case ItemStore.delete(String.to_integer(id)) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Item not found"})

      _item ->
        send_resp(conn, :no_content, "")
    end
  end
end