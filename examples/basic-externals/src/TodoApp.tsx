import { Button, Card, Checkbox, Input, List, Space, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons'
import React, { useMemo, useState } from 'react';
import { useExternals } from './externals/Context';

type Todo = { id: string; title: string; completed: boolean };

export const TodoApp: React.FC = () => {
  const { analytics } = useExternals();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [search, setSearch] = useState('');

  const filteredTodos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return todos;
    }
    return todos.filter((todo) =>
      todo.title.toLowerCase().includes(normalizedSearch),
    );
  }, [search, todos]);

  const handleAddTodo = () => {
    const normalizedTitle = newTodoText.trim();
    if (!normalizedTitle) {
      return;
    }

    analytics.log('TODO_ADDED');

    setTodos((currentTodos) => [
      ...currentTodos,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: normalizedTitle,
        completed: false,
      },
    ]);
    setNewTodoText('');
  };

  const handleToggleTodo = (todoId: string) => {
    analytics.log('TODO_TOGGLED');

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleRemoveTodo = (todoId: string) => {
    analytics.log('TODO_DELETED');

    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== todoId),
    );
  };

  return (
    <main className="todo-app-shell">
      <Card className="todo-card" bordered={false}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Todo List
          </Typography.Title>
          <Input.Search
            placeholder="Add a todo"
            value={newTodoText}
            onChange={(event) => setNewTodoText(event.target.value)}
            onSearch={handleAddTodo}
            enterButton="Add"
            size="large"
          />
          <Input
            placeholder="Search todos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            size="large"
            allowClear
          />
          <List
            dataSource={filteredTodos}
            locale={{ emptyText: 'No todos yet' }}
            renderItem={(todo) => (
              <List.Item
                actions={[
                  <Button
                    key={`remove-${todo.id}`}
                    type="text"
                    danger
                    onClick={() => handleRemoveTodo(todo.id)}
                  >
                    Remove
                  </Button>,
                ]}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                >
                  <span
                    className={
                      todo.completed
                        ? 'todo-title todo-title-completed'
                        : 'todo-title'
                    }
                  >
                    {todo.title}
                  </span>
                </Checkbox>
              </List.Item>
            )}
          />
        </Space>
      </Card>
    </main>
  );
};
