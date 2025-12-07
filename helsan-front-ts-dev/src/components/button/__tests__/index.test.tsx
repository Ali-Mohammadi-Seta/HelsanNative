import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import CustomButton from "../index";

describe("CustomButton", () => {
  it("should render button with text", () => {
    render(<CustomButton>Click Me</CustomButton>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("should call onClick handler when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<CustomButton onClick={handleClick}>Click Me</CustomButton>);
    const button = screen.getByRole("button", { name: /click me/i });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<CustomButton disabled>Disabled Button</CustomButton>);
    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
  });

  it("should show loading state", () => {
    render(<CustomButton loading>Loading Button</CustomButton>);
    const button = screen.getByRole("button", { name: /loading button/i });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
  });

  it("should render as anchor when href is provided", () => {
    render(<CustomButton href="/test">Link Button</CustomButton>);
    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toHaveAttribute("href", "/test");
  });

  it("should apply correct type classes", () => {
    const { rerender } = render(
      <CustomButton type="primary">Primary</CustomButton>
    );
    let button = screen.getByRole("button", { name: /primary/i });
    // Default variant is "solid", so it should have bg-colorPrimary and text-white
    expect(button.className).toContain("bg-colorPrimary");

    rerender(
      <CustomButton type="primary" variant="text">
        Primary Text
      </CustomButton>
    );
    button = screen.getByRole("button", { name: /primary text/i });
    expect(button.className).toContain("text-colorPrimary");

    rerender(<CustomButton type="danger">Danger</CustomButton>);
    button = screen.getByRole("button", { name: /danger/i });
    // Default variant is "solid", so it should have bg-red-600
    expect(button.className).toContain("bg-red-600");

    rerender(
      <CustomButton type="danger" variant="text">
        Danger Text
      </CustomButton>
    );
    button = screen.getByRole("button", { name: /danger text/i });
    expect(button.className).toContain("text-red-600");
  });

  it("should apply correct size classes", () => {
    const { rerender } = render(
      <CustomButton size="large">Large</CustomButton>
    );
    let button = screen.getByRole("button", { name: /large/i });
    expect(button.className).toContain("text-base");

    rerender(<CustomButton size="small">Small</CustomButton>);
    button = screen.getByRole("button", { name: /small/i });
    expect(button.className).toContain("text-xs");
  });

  it("should render with icon", () => {
    const icon = <span data-testid="icon">🚀</span>;
    render(<CustomButton icon={icon}>With Icon</CustomButton>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("should not call onClick when disabled anchor is clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <CustomButton href="/test" disabled onClick={handleClick}>
        Disabled Link
      </CustomButton>
    );
    const link = screen.getByRole("link", { name: /disabled link/i });

    await user.click(link);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
