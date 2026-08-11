import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AlertCard from "@/components/feed/AlertCard";
import { Alert } from "@/types";

const mockAlert: Alert = {
    id: "1",
    title: "Test Alert",
    description: "Desc",
    severity: "high",
    type: "flood",
    coordinates: [0, 0],
    radius: 1,
    startTime: new Date().toISOString(),
};

describe("AlertCard", () => {
    it("renders alert title and severity", () => {
        render(<AlertCard alert={mockAlert} />);
        expect(screen.getByText("Test Alert")).toBeInTheDocument();
        expect(screen.getByText("high")).toBeInTheDocument();
    });

    it("renders critical severity with correct color class", () => {
        const criticalAlert = { ...mockAlert, severity: "critical" as const };
        render(<AlertCard alert={criticalAlert} />);
        const badge = screen.getByText("critical");
        expect(badge).toHaveClass("bg-red-100");
    });
});

describe("useSOSStore", () => {
    it("starts with empty sosList", async () => {
        const { useSOSStore } = await import("@/stores/useSOSStore");
        const state = useSOSStore.getState();
        expect(state.sosList).toEqual([]);
    });
});

describe("useNetworkStatus", () => {
    it("returns isOnline true by default", async () => {
        const useNetworkStatus = (await import("@/hooks/useNetworkStatus")).default;
        const Component = () => {
            const { isOnline } = useNetworkStatus();
            return <div data-testid="status">{isOnline ? "online" : "offline"}</div>;
        };
        render(<Component />);
        expect(screen.getByTestId("status").textContent).toBe("online");
    });
});
