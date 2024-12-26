import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const user = await currentUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="absolute top-4 right-4">
        <UserButton />
      </div>
      {user ? (
        <div>Welcome, {user.username}</div>
      ) : (
        <div>Please sign in</div>
      )}
    </main>
  );
}
