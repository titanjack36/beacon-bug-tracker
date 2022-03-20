import { Link } from 'react-router-dom';
import '../../styles/Menu.scss';
import ProfileOptions from './ProfileOptions';
import SearchBar from './SearchBar';

function TopMenu() {
    return (
        <div className="top-menu">
            <div className="top-menu-left">
                <SearchBar />
            </div>
            <div className="top-menu-right">
                <Link to="settings" className="link-settings">
                    <span className="icon icon-settings"></span>
                </Link>
                <ProfileOptions />
            </div>
        </div>
    );
}

export default TopMenu;