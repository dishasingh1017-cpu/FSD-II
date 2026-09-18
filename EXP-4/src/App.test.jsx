import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("PostFlow Performance Lab", () => {
  beforeEach(() => {
    render(<App />);
  });

  // --------------------------------------------------
  // BASIC APPLICATION TESTS
  // --------------------------------------------------

  it("renders PostFlow application", () => {
    expect(screen.getByText("PostFlow")).toBeInTheDocument();
    expect(
      screen.getByText("Scheduling & Performance Lab")
    ).toBeInTheDocument();
  });

  it("renders Experiment 1.4.1", () => {
    expect(
      screen.getByText("EXPERIMENT 1.4.1")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Content Calendar")
    ).toBeInTheDocument();
  });

  it("renders Experiment 1.4.2", () => {
    expect(
      screen.getByText("EXPERIMENT 1.4.2")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Performance Lab")
    ).toBeInTheDocument();
  });

  // --------------------------------------------------
  // CALENDAR TESTS
  // --------------------------------------------------

  it("renders all seven days", () => {
    expect(screen.getByText("MON")).toBeInTheDocument();
    expect(screen.getByText("TUE")).toBeInTheDocument();
    expect(screen.getByText("WED")).toBeInTheDocument();
    expect(screen.getByText("THU")).toBeInTheDocument();
    expect(screen.getByText("FRI")).toBeInTheDocument();
    expect(screen.getByText("SAT")).toBeInTheDocument();
    expect(screen.getByText("SUN")).toBeInTheDocument();
  });

  it("renders the calendar week", () => {
    expect(
      screen.getByText("Sep 7 – Sep 13, 2026")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/7 posts/i)
    ).toBeInTheDocument();
  });

  it("renders time slots", () => {
    expect(screen.getByText("8:00 AM")).toBeInTheDocument();
    expect(screen.getByText("9:00 AM")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    expect(screen.getByText("11:00 AM")).toBeInTheDocument();
    expect(screen.getByText("12:00 PM")).toBeInTheDocument();
    expect(screen.getByText("1:00 PM")).toBeInTheDocument();
    expect(screen.getByText("2:00 PM")).toBeInTheDocument();
    expect(screen.getByText("3:00 PM")).toBeInTheDocument();
    expect(screen.getByText("4:00 PM")).toBeInTheDocument();
    expect(screen.getByText("5:00 PM")).toBeInTheDocument();
  });

  // --------------------------------------------------
  // POST TESTS
  // --------------------------------------------------

  it("loads initial posts", () => {
    expect(
      screen.getByText("React Performance Tips")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Web Development Roadmap")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Full Stack Development")
    ).toBeInTheDocument();

    expect(
      screen.getByText("JavaScript ES2026")
    ).toBeInTheDocument();

    expect(
      screen.getByText("CSS Grid Masterclass")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Building Better UIs")
    ).toBeInTheDocument();
  });

  it("renders draggable post cards", () => {
    const cards = document.querySelectorAll(".post-card");

    expect(cards.length).toBeGreaterThan(0);

    cards.forEach((card) => {
      expect(card).toHaveAttribute("draggable", "true");
    });
  });

  it("shows drag and drop help text", () => {
    expect(
      screen.getByText(
        /Click a post to edit it\. Drag a post to another time slot to reschedule it\./i
      )
    ).toBeInTheDocument();
  });

  // --------------------------------------------------
  // PERFORMANCE PANEL
  // --------------------------------------------------

  it("starts in baseline non-optimized mode", () => {
    expect(
      screen.getByText("Non-Optimized")
    ).toBeInTheDocument();

    expect(
      screen.getByText("BASELINE")
    ).toBeInTheDocument();
  });

  it("renders optimization controls", () => {
    expect(
      screen.getByText("React.memo")
    ).toBeInTheDocument();

    expect(
      screen.getByText("useCallback")
    ).toBeInTheDocument();

    expect(
      screen.getByText("useMemo")
    ).toBeInTheDocument();
  });

  it("optimization controls are disabled in baseline mode", () => {
    const checkboxes = document.querySelectorAll(
      '.options input[type="checkbox"]'
    );

    expect(checkboxes.length).toBe(3);

    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled();
    });
  });

  // --------------------------------------------------
  // OPTIMIZED MODE
  // --------------------------------------------------

  it("can switch to optimized mode", () => {
    const optimizedButton = screen.getByText("Optimized");

    fireEvent.click(optimizedButton);

    expect(
      screen.getByText("Optimized")
    ).toBeInTheDocument();
  });

  it("enables optimization controls in optimized mode", () => {
    fireEvent.click(screen.getByText("Optimized"));

    const checkboxes = document.querySelectorAll(
      '.options input[type="checkbox"]'
    );

    expect(checkboxes.length).toBe(3);

    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeDisabled();
    });
  });

  it("can enable React.memo", () => {
    fireEvent.click(screen.getByText("Optimized"));

    const checkbox = document.querySelector(
      '.options input[type="checkbox"]'
    );

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("can enable useCallback", () => {
    fireEvent.click(screen.getByText("Optimized"));

    const checkboxes = document.querySelectorAll(
      '.options input[type="checkbox"]'
    );

    fireEvent.click(checkboxes[1]);

    expect(checkboxes[1]).toBeChecked();
  });

  it("can enable useMemo", () => {
    fireEvent.click(screen.getByText("Optimized"));

    const checkboxes = document.querySelectorAll(
      '.options input[type="checkbox"]'
    );

    fireEvent.click(checkboxes[2]);

    expect(checkboxes[2]).toBeChecked();
  });

  // --------------------------------------------------
  // PERFORMANCE METRICS
  // --------------------------------------------------

  it("renders interaction metrics", () => {
    expect(
      screen.getByText("Interaction Metrics")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Calendar renders")
    ).toBeInTheDocument();

    expect(
      screen.getByText("PostCard renders")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Last drag time")
    ).toBeInTheDocument();
  });

  it("renders expected result comparison", () => {
    expect(
      screen.getByText("Expected Result")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Non-optimized →/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/React\.memo →/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/memo \+ useCallback →/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/All optimizations →/i)
    ).toBeInTheDocument();
  });

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  it("has a reset metrics button", () => {
    expect(
      screen.getByRole("button", {
        name: /reset/i,
      })
    ).toBeInTheDocument();
  });

  // --------------------------------------------------
  // CREATE POST
  // --------------------------------------------------

  it("opens the new post form", () => {
    fireEvent.click(
      screen.getByRole("button", {
        name: /new post/i,
      })
    );

    expect(
      screen.getByText(/Create Post/i)
    ).toBeInTheDocument();
  });

  it("can cancel creating a post", () => {
    fireEvent.click(
      screen.getByRole("button", {
        name: /new post/i,
      })
    );

    const cancelButton = screen.getByRole("button", {
      name: /cancel/i,
    });

    fireEvent.click(cancelButton);

    expect(
      screen.queryByText(/Create Post/i)
    ).not.toBeInTheDocument();
  });

  // --------------------------------------------------
  // WEEK NAVIGATION
  // --------------------------------------------------

  it("has week navigation controls", () => {
    expect(
      screen.getByRole("button", { name: "‹" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "›" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Today" })
    ).toBeInTheDocument();
  });
});