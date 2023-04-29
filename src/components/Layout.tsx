import { useEffect, useState } from "react"
import Header from "./Header"
import SideNav from "./SideNav"
import TodoList from "./TodoList"
import { getCookie, setCookie } from "cookies-next"

const Layout: React.FC = () => {
    const [selectedListId, setSelectedListId] = useState("");

    useEffect(() => {
        const selected = getCookie("selected")
        if (selected) {
            setSelectedListId(selected.toString())
        }
    }, [])

    const onSelectList = (id: string) => {
        setSelectedListId(id)
        setCookie("selected", id)
    }

    return (
        <>
            <Header />
            <div className="flex w-full h-screen">
                <SideNav selectedId={selectedListId} setSelectedId={onSelectList} />
                <div className="flex-grow">
                    <TodoList listId={selectedListId} />
                </div>
            </div>
        </>
    )
}

export default Layout
