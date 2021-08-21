import { ChatMessage, ChatMessageType, ChatUser } from '@ws-example/chat';
import * as faker from 'faker';
import { Server } from 'ws';

const wsServer = new Server({ port: 8080 });
const usersList: ChatUser[] = [];

wsServer.on('connection', (ws) => {
  const sendToAll = (message: ChatMessage): void => {
    wsServer.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(createData(message));
      }
    });
  };

  const sendToAllExceptSelf = (message: ChatMessage): void => {
    wsServer.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(createData(message));
      }
    });
  };

  const sendToSelf = (message: ChatMessage): void => {
    ws.send(createData(message));
  };

  const createData = (message: ChatMessage): string => {
    return JSON.stringify(message);
  };

  const user: ChatUser = {
    username: faker.internet.userName(),
  };

  usersList.push(user);

  ws.on('open', () => {
    sendToSelf({
      type: ChatMessageType.UserDetails,
      data: {
        userDetails: {
          user,
        },
      },
    });

    sendToSelf({
      type: ChatMessageType.UsersList,
      data: {
        usersList: {
          users: usersList,
        },
      },
    });

    sendToAllExceptSelf({
      type: ChatMessageType.UserJoin,
      data: {
        userJoin: {
          user,
        },
      },
    });
  });

  ws.on('close', () => {
    sendToAllExceptSelf({
      type: ChatMessageType.UserLeave,
      data: {
        userJoin: {
          user,
        },
      },
    });
  });

  ws.on('message', (data) => {
    const dataParsed: ChatMessage = JSON.parse(data as string);
    if (dataParsed.type === ChatMessageType.SendMessage) {
      sendToAll({
        type: ChatMessageType.AcceptMessage,
        data: {
          acceptMessage: {
            user,
            content: dataParsed.data.sendMessage.content,
            createdAt: new Date(),
          },
        },
      });
    }
  });
});
