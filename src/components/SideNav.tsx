import type { inferProcedureOutput } from "@trpc/server";
import styles from "./SideNav.module.css"
import { api } from "~/utils/api"
import type { AppRouter } from "~/server/api/root";
import { useState } from "react";

type TodoList = inferProcedureOutput<AppRouter["listRouter"]["all"]>[number];

const SideNav = () => {
    const context = api.useContext()
    const allLists = api.listRouter.all.useQuery(undefined, { staleTime: 3000 });
    const addList = api.listRouter.addList.useMutation({
        async onMutate({ name }) {
            await context.listRouter.all.cancel();
            const lists = allLists.data ?? [];
            context.listRouter.all.setData(undefined, [
                ...lists,
                {
                    id: `${Math.random()}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    creatorId: "something",
                    name: name,
                }
            ])
        }
    })

    const [selectedList, setSelectedList] = useState("")


    const onListSelected = (id: string) => {
        console.log(id);
        setSelectedList(id);
    }

    return (
        <div className={styles.side_nav}>
            <div className="flex">
                <h2 className="text-4xl m-3">Lists</h2>
                <div className="flex-grow"></div>
                <button
                    className={styles.add_list_button}
                    onClick={() => { addList.mutate({ name: "new list" }) }}>
                    <p className="">+</p>
                </button>
            </div>
            {allLists.data?.map((l) => {
                const isSelected = selectedList == l.id
                return (<ListRow key={l.id} list={l} onClick={() => { onListSelected(l.id) }} selected={isSelected} />)
            })}
        </div>
    )
}

const ListRow = (props: { list: TodoList, onClick: () => void, selected: boolean }) => {
    return (
        <div className={`${styles.list_row} ${props.selected ? styles.list_row_selected : ""}`} onClick={props.onClick}>
            <p className="px-3">{props.list.name}</p>
            <div className="flex-grow"></div>
            <p className="px-3">...</p>
        </div>
    )
}

export default SideNav;
