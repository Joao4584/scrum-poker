export interface RoomListItem {
  id: string;
  title: string;
  imageUrl: string;
  playersCurrent: number;
  playersMax: number;
  createdAt: string;
}

export interface RoomListOutput {
  data: RoomListItem[];
}

const mockRooms: RoomListItem[] = [
  {
    id: "room-1",
    title: "Sprint Planning Poker",
    imageUrl: "/banners/auth.gif",
    playersCurrent: 12,
    playersMax: 20,
    createdAt: "2025-12-27T03:04:19Z",
  },
  {
    id: "room-2",
    title: "Daily Refinement",
    imageUrl: "/banners/auth-dark.gif",
    playersCurrent: 7,
    playersMax: 10,
    createdAt: "2025-12-26T21:15:42Z",
  },
  {
    id: "room-3",
    title: "Estimation Retro",
    imageUrl: "/banners/auth.gif",
    playersCurrent: 4,
    playersMax: 8,
    createdAt: "2025-12-25T18:02:03Z",
  },
  {
    id: "room-4",
    title: "Release Planning",
    imageUrl: "/banners/auth-dark.gif",
    playersCurrent: 9,
    playersMax: 15,
    createdAt: "2025-12-24T14:45:10Z",
  },
  {
    id: "room-5",
    title: "Sprint Review",
    imageUrl: "/banners/auth.gif",
    playersCurrent: 6,
    playersMax: 12,
    createdAt: "2025-12-23T09:28:51Z",
  },
  {
    id: "room-6",
    title: "Backlog Grooming",
    imageUrl: "/banners/auth-dark.gif",
    playersCurrent: 3,
    playersMax: 10,
    createdAt: "2025-12-22T11:05:33Z",
  },
  {
    id: "room-7",
    title: "Tech Debt Estimation",
    imageUrl: "/banners/auth.gif",
    playersCurrent: 5,
    playersMax: 9,
    createdAt: "2025-12-21T16:52:09Z",
  },
  {
    id: "room-8",
    title: "UX Sprint Poker",
    imageUrl: "/banners/auth-dark.gif",
    playersCurrent: 8,
    playersMax: 16,
    createdAt: "2025-12-20T20:11:27Z",
  },
  {
    id: "room-9",
    title: "Bug Triage Estimation",
    imageUrl: "/banners/auth.gif",
    playersCurrent: 10,
    playersMax: 14,
    createdAt: "2025-12-19T13:37:58Z",
  },
  {
    id: "room-10",
    title: "Ops Poker Night",
    imageUrl: "/banners/auth-dark.gif",
    playersCurrent: 2,
    playersMax: 6,
    createdAt: "2025-12-18T08:23:44Z",
  },
  {
    id: "room-11",
    title: "Mobile Sprint Planning",
    imageUrl: "/banners/auth.gif",
    playersCurrent: 11,
    playersMax: 20,
    createdAt: "2025-12-17T17:59:05Z",
  },
];

export async function getRooms(): Promise<RoomListOutput> {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  return {
    data: mockRooms,
  };
}
