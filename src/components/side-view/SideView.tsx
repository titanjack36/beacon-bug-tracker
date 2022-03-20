import SideViewMenu from "./SideViewMenu";
import '../../styles/SideView.scss';
import SideContent from "./SideContent";

function SideView() {
  return (
    <div className="side-view">
      <SideViewMenu />
      <SideContent />
    </div>
  );
}

export default SideView;