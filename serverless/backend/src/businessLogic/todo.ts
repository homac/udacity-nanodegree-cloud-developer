import {TodoItem} from "../models/TodoItem";
import {TodoAccess} from "../dataLayer/todoAccess";
import {parseUserId} from "../auth/utils";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {TodoUpdate} from "../models/TodoUpdate";

const uuidv4 = require('uuid/v4');
const todoAccess = new TodoAccess();
const bucketName = process.env.S3_BUCKET_NAME

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return todoAccess.getAllTodos(userId);
}

export function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
  const uuid = require('uuid')
  const todoId = uuid.v4()

  const todoItem = {
    userId: parseUserId(jwtToken),
    todoId: todoId,
    createdAt: new Date().getTime().toString(),
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
    ...createTodoRequest
  }

    return todoAccess.createTodo(todoItem);
}

export function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return todoAccess.updateTodo(updateTodoRequest, todoId, userId);
}

export function deleteTodo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return todoAccess.deleteTodo(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
    return todoAccess.generateUploadUrl(todoId);
}
