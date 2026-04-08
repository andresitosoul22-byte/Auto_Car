import { render, screen } from "@testing-library/react";
import App from "./App";

test("muestra encabezado y área cliente", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /vehículos eléctricos e híbridos/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /área cliente/i })).toBeInTheDocument();
});
