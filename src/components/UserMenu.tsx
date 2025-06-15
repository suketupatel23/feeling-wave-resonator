
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const UserMenu = () => {
  const { profile, user, logout, loading } = useAuth();

  if (!user) return null;
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>
          {profile?.username
            ? profile.username.slice(0, 2).toUpperCase()
            : user.email?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <span className="text-base font-medium mr-2">
        {profile?.username || user.email}
      </span>
      <Button variant="outline" size="sm" onClick={logout} disabled={loading}>
        Logout
      </Button>
    </div>
  );
};
export default UserMenu;
