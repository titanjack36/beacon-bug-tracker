import { useMatch, useResolvedPath, LinkProps, Link } from "react-router-dom";

function ProjectMenuLink({ children, to, ...props }: LinkProps) {
  const path = useResolvedPath(to);
  const match = useMatch({ path: path.pathname, end: true });

  return (
    <Link to={to} className={match ? 'active' : ''} {...props}>{children}</Link>
  );
}

export default ProjectMenuLink;