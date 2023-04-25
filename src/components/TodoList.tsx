import type { inferProcedureOutput } from "@trpc/server";

import { api } from "~/utils/api";
import { useState } from "react";
import type { AppRouter } from "~/server/api/root";
import styles from "./TodoList.module.css"

type Todo = inferProcedureOutput<AppRouter["todoRouter"]["all"]>[number];

const TodoList = (props: { listId: string }) => {
    const [newTodoTitle, setNewTodoTitle] = useState<string>("");
    const allTodos = api.todoRouter.all.useQuery({ listId: props.listId }, { staleTime: 3000 });
    const context = api.useContext()
    const mutation = api.todoRouter.addTodo.useMutation({
        async onSuccess(data) {
            await context.todoRouter.all.cancel();
            const todos = allTodos.data ?? [];
            context.todoRouter.all.setData(
                { listId: props.listId },
                [
                    ...todos,
                    data
                ]
            )
        }
    });

    const completedTodos: Todo[] | undefined = allTodos.data?.filter(todo => todo.completed);
    const remainingTodos: Todo[] | undefined = allTodos.data?.filter(todo => !todo.completed);

    const handleNewTodoTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodoTitle(e.target.value);
    }

    const addTodo = () => {
        mutation.mutate({ title: newTodoTitle, listId: props.listId });
        setNewTodoTitle("")
    }

    return (
        <div className="border-2 border-black m-10 p-10 text-3xl font-extrabold bg-[#FCE181]">
            <div className="flex pb-3">
                <input
                    type="text"
                    value={newTodoTitle}
                    onChange={handleNewTodoTitleChange}
                    className={styles.add_todo_input}
                />
                <button
                    className={styles.add_todo_button}
                    onClick={addTodo}
                >
                    Add Todo
                </button>
            </div>
            <div>
                {remainingTodos?.map((todo: Todo) => {
                    return <TodoElement todo={todo} key={todo.id} />
                })}
            </div>
            <br />
            <div>
                {completedTodos?.map((todo: Todo) => {
                    return <TodoElement todo={todo} key={todo.id} />
                })}
            </div>
        </div>
    )
}

const TodoElement = (props: { todo: Todo }) => {
    const { todo } = props;
    const context = api.useContext()

    const deleteTodo = api.todoRouter.deleteTodo.useMutation({
        async onMutate() {
            console.log("deleting " + props.todo.id)
            await context.todoRouter.all.cancel();
            const allTodos = context.todoRouter.all.getData({ listId: props.todo.listId });
            if (!allTodos) {
                return
            }
            context.todoRouter.all.setData(
                { listId: todo.listId },
                allTodos.filter((t) => t.id != todo.id)
            );
        }
    })

    const edit = api.todoRouter.editTodo.useMutation({
        async onMutate({ id, data }) {
            await context.todoRouter.all.cancel();
            const allTodos = context.todoRouter.all.getData();
            if (!allTodos) {
                return
            }
            context.todoRouter.all.setData(
                { listId: props.todo.listId },
                allTodos.map((t) => t.id === id ? { ...t, ...data, } : t)
            )
        }
    })
    return (
        <div className={styles.todo}>
            <input
                id={`check-box-${todo.id}`}
                type="checkbox"
                checked={todo.completed}
                name="bordered-checkbox"
                className={styles.todo_checkbox}
                onChange={(e) => edit.mutate({ id: todo.id, data: { completed: e.currentTarget.checked } })}
            />
            <label
                className="w-full py-4 ml-2 text-sm font-medium">
                {todo.title}
            </label>
            <div className="flex-grow"></div>
            <button
                className="text-[#E85A4F] rounded-full w-12 h-12 px-6 py-2 flex justify-center align-center"
                onClick={() => deleteTodo.mutate({ id: todo.id })}
            >
                ...
            </button>
        </div >
    )
}

export default TodoList
