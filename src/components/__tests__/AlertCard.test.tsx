import { render, screen } from "@testing-library/react";
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

test("renders alert title and severity", () => {
    render(<AlertCard alert={mockAlert} />);
    expect(screen.getByText("Test Alert")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
});