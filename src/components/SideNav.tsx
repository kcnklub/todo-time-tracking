import type { inferProcedureOutput } from "@trpc/server";
import styles from "./SideNav.module.css"
import { api } from "~/utils/api"
import type { AppRouter } from "~/server/api/root";
import Popup from "reactjs-popup";
import { useState } from "react";

type TodoList = inferProcedureOutput<AppRouter["listRouter"]["all"]>[number];

const SideNav = (props: { selectedId: string, setSelectedId: (id: string) => void }) => {
    const context = api.useContext()
    const allLists = api.listRouter.all.useQuery(undefined, { staleTime: 3000 });
    const addList = api.listRouter.addList.useMutation({
        async onSuccess(data) {
            await context.listRouter.all.cancel();
            const lists = allLists.data ?? []
            context.listRouter.all.setData(
                undefined,
                [
                    ...lists,
                    data
                ]
            )
        }
    })

    const onListSelected = (id: string) => {
        console.log(id);
        props.setSelectedId(id);
    }

    const [newListName, setNewListName] = useState("")
    const onNamechanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewListName(event.target.value);
    }
    const onAddAction = () => {
        addList.mutate({ name: newListName })
        setNewListName("")
    }

    return (
        <div className={styles.side_nav}>
            <div className="flex">
                <h2 className="text-4xl m-3">Lists</h2>
            </div>
            <div className="flex">
                <input
                    className="flex-grow my-2 mx-3 border-2 border-black rounded"
                    type="text"
                    value={newListName}
                    onChange={onNamechanged}
                    onKeyDown={(e) => {
                        const text = e.currentTarget.value.trim()
                        if (e.key === "Enter" && text) {
                            onAddAction()
                        }
                    }}
                />
            </div>
            {allLists.data?.map((l) => {
                const isSelected = props.selectedId == l.id
                return (
                    <ListRow
                        key={l.id}
                        list={l}
                        onClick={() => { onListSelected(l.id) }}
                        selected={isSelected}
                    />
                )
            })}
        </div>
    )
}

const ListRow = (props: { list: TodoList, onClick: (id: string) => void, selected: boolean }) => {
    const context = api.useContext()
    const deleteList = api.listRouter.deleteList.useMutation({
        async onMutate() {
            await context.listRouter.all.cancel()
            const allLists = context.listRouter.all.getData();
            if (!allLists) {
                return
            }
            context.listRouter.all.setData(
                undefined,
                allLists.filter((l) => l.id != props.list.id)
            )
        }
    });

    const onSelection = () => {
        props.onClick(props.list.id)
    }

    const onDelete = () => {
        deleteList.mutate({ id: props.list.id })
        props.onClick("")
    }

    return (
        <div
            className={`${styles.list_row || ""} ${props.selected ? styles.list_row_selected || "" : ""}`}
            onClick={onSelection}
        >
            <p className="px-3">{props.list.name}</p>
            <div className="flex-grow"></div>
            <div className="menu">
                <Popup
                    trigger={<div className="px-3">...</div>}
                    on="hover"
                >
                    <div className={styles.list_options}>
                        <div className={styles.list_option_item}>edit</div>
                        <div
                            className={styles.list_option_item}
                            onClick={onDelete}
                        >
                            delete
                        </div>
                    </div>
                </Popup>
            </div>
        </div>
    )
}

export default SideNav;
