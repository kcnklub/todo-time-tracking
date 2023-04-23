import { useState } from "react"
import Header from "./Header"
import SideNav from "./SideNav"
import TodoList from "./TodoList"

const Layout: React.FC = () => {
    const [selectedListId, setSelectedListId] = useState("");
    return (
        <>
            <Header />
            <div className="flex w-full h-full">
                <SideNav selectedId={selectedListId} setSelectedId={setSelectedListId} />
                <div className="container">
                    <TodoList listId={selectedListId} />
                </div>
            </div>
        </>
    )
}

export default Layout
