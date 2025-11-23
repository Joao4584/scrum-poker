interface PageProps {
  params: {
    roomId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { roomId } = params;

  return <div className="a">Landing - Room ID: {roomId}</div>;
}
