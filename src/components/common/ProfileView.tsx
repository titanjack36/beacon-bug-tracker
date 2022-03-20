import { Link } from "react-router-dom";
import { Profile } from "../../models/task.type";

type ProfileViewProps = {
  profile: Profile;
  showName?: boolean;
} & React.AllHTMLAttributes<HTMLDivElement>;

export default function ProfileLink({ profile, showName=false, className="", ...props }: ProfileViewProps) {
  return (
    <div className={`profile-view ${className}`} {...props}>
      <img className="profile-image" src={profile.profileImageUrl} />
      {
        showName && <div className="profile-name">{profile.name}</div>
      }
    </div>
  );
}