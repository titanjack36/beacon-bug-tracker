import SideViewMenu from "./SideViewMenu";
import '../../styles/SideView.scss';
import SideContent from "./SideContent";

type SideViewProps = {
  showProject: boolean;
}

function SideView({ showProject }: SideViewProps ) {
  return (
    <div className="side-view">
      <SideViewMenu showProject={showProject} />
      <SideContent />
    </div>
  );
}

export default SideView;