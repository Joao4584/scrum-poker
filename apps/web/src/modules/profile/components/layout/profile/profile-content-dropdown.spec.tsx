import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useTheme } from "next-themes";

import { ListContentDropDown } from "./profile-content-dropdown";

jest.mock("@/modules/shared/ui/dropdown-menu");
jest.mock("./profile-character-select", () => ({
  ProfileCharacterSelect: () => <div data-testid="profile-character-select" />,
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = jest.mocked(useTheme);

describe("ListContentDropDown", () => {
  const setTheme = jest.fn();

  beforeEach(() => {
    setTheme.mockClear();
  });

  // Garante que ao clicar no item de tema com tema escuro, o componente solicita tema claro.
  it("troca de dark para light ao clicar no item de tema", async () => {
    mockUseTheme.mockReturnValue({ theme: "dark", setTheme } as any);

    const user = userEvent.setup();

    render(<ListContentDropDown />);

    await user.click(screen.getByRole("button", { name: /modo claro/i }));

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  // Garante que ao clicar no item de tema com tema claro, o componente solicita tema escuro.
  it("troca de light para dark ao clicar no item de tema", async () => {
    mockUseTheme.mockReturnValue({ theme: "light", setTheme } as any);
    const user = userEvent.setup();

    render(<ListContentDropDown />);

    await user.click(screen.getByRole("button", { name: /modo escuro/i }));

    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
