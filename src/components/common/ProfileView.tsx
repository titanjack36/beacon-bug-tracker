import { Link } from "react-router-dom";
import { Profile } from "../../models/task.type";
import '../../styles/Profile.scss';

type ProfileViewProps = {
  profile?: Profile;
  showName?: boolean;
} & React.AllHTMLAttributes<HTMLDivElement>;

export default function ProfileLink({ profile, showName=false, className="", ...props }: ProfileViewProps) {
  return (
    <div className={`profile-view ${className}`} {...props}>
      {
        profile ? (
          <img className="profile-image" src={profile.profileImageUrl} />
        ) : (
          <div className="profile-image placeholder"/>
        )
      }
      {
        profile && showName && <div className="profile-name">{profile.name}</div>
      }
    </div>
  );
}