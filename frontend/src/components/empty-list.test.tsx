import { render, screen } from "@testing-library/react";
import { Tag } from "lucide-react";
import { describe, expect, it } from "vitest";

import { EmptyList } from "@/components/empty-list";
import { Button } from "@/components/ui/button";

describe("EmptyList", () => {
  it("renders the title", () => {
    render(<EmptyList icon={Tag} title="Nenhuma categoria por aqui" />);

    expect(screen.getByText("Nenhuma categoria por aqui")).toBeVisible();
  });

  it("renders the description when it is given", () => {
    render(
      <EmptyList
        icon={Tag}
        title="Nenhuma categoria"
        description="Crie a primeira para começar."
      />,
    );

    expect(screen.getByText("Crie a primeira para começar.")).toBeVisible();
  });

  it("works without a description", () => {
    render(<EmptyList icon={Tag} title="Lista vazia" />);

    expect(screen.getByText("Lista vazia")).toBeVisible();
  });

  it("renders the action when it is given", () => {
    render(
      <EmptyList
        icon={Tag}
        title="Lista vazia"
        action={<Button>Nova categoria</Button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Nova categoria" }),
    ).toBeVisible();
  });

  it("does not render an action area by default", () => {
    render(<EmptyList icon={Tag} title="Lista vazia" />);

    expect(screen.queryByRole("button")).toBeNull();
  });
});
