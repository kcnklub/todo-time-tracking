import Header from "./Header"
import SideNav from "./SideNav"

type LayoutProps = {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
    return (
        <>
            <Header />
            <SideNav />
            <div>
                {props.children}
            </div>
        </>
    )
}

export default Layout
