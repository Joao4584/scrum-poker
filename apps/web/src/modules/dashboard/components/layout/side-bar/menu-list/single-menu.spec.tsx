import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useSidebarSizeStore } from "@/modules/dashboard/stores/sidebar-size.store";

import SingleMenu from "./single-menu";

jest.mock("@/modules/shared/ui/skeleton");
jest.mock("@/modules/shared/ui/tooltip");
jest.mock("@/modules/dashboard/stores/sidebar-size.store");

const mockUseSidebarSizeStore = jest.mocked(useSidebarSizeStore);

const baseRoute = {
  path: "/rooms",
  title: "Salas",
  icon: () => <svg data-testid="menu-icon" />,
};

describe("SingleMenu", () => {
  const router = { push: jest.fn() };
  let minimized = false;

  beforeEach(() => {
    jest.useFakeTimers();
    router.push.mockClear();
    minimized = false;
    mockUseSidebarSizeStore.mockImplementation((selector) => selector({ minimized } as any));
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Garante que ao clicar no item ele navega para o caminho completo.
  it("navega para o caminho do menu ao clicar", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SingleMenu route={baseRoute as any} isActive={false} router={router} basePath="/dashboard" />);

    await user.click(screen.getByRole("listitem"));

    expect(router.push).toHaveBeenCalledWith("/dashboard/rooms");
  });

  // Garante que o skeleton aparece inicialmente e some depois do timeout.
  it("mostra skeleton no inicio e remove apos 600ms", () => {
    render(<SingleMenu route={baseRoute as any} isActive={false} router={router} basePath="/dashboard" />);

    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);

    act(() => {
      jest.advanceTimersByTime(600);
    });

    return waitFor(() => expect(screen.queryAllByTestId("skeleton")).toHaveLength(0));
  });
});
