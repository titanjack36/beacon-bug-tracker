import { Profile } from "../../models/user.type";
import ProfileView from "../common/ProfileView";

type MemberViewProps = {
  members?: Profile[];
};

export default function MemberView({ members=[] }: MemberViewProps) {
  return (
    <div className="member-view">
      <div className="member-list">
        {
          members.slice(0, 5).map(member => <ProfileView key={member.username} profile={member} />)
        }
      </div>
      <button className="view-members-btn">
        <span className="icon icon-more"/>
      </button>
    </div>
  );
}
