import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/locations/$locationId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { locationId } = Route.useParams();

  return <div>Hello "/locations/{locationId}"!</div>;
}
