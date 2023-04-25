import { useState } from "react"
import Header from "./Header"
import SideNav from "./SideNav"
import TodoList from "./TodoList"

const Layout: React.FC = () => {
    const [selectedListId, setSelectedListId] = useState("");
    return (
        <>
            <Header />
            <div className="flex w-full h-screen">
                <SideNav selectedId={selectedListId} setSelectedId={setSelectedListId} />
                <div className="flex-grow">
                    <TodoList listId={selectedListId} />
                </div>
            </div>
        </>
    )
}

export default Layout
