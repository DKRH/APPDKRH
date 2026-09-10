defmodule ElixirphoenixWeb.PageController do
  use ElixirphoenixWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
