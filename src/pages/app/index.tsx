import { Task } from "@prisma/client";
import { GetServerSideProps } from "next";
import { FormEvent, useState } from "react";

import { prisma } from "../../lib/prisma";

interface AppProps {
  tasks: Task[];
}

export default function App({ tasks }: AppProps) {
  const [title, setTitle] = useState("");

  async function handleCreateTask(event: FormEvent) {
    event.preventDefault();

    await fetch("http://localhost:3000/api/tasks/create", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return (
    <div>
      <h1>List tasks</h1>
      <ul>
        {tasks.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>

      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tasks = await prisma.task.findMany();

  const data = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    isDone: task.isDone,
    createdAt: task.createdAt.toISOString(),
  }));

  return {
    props: {
      tasks: data,
    },
  };
};
