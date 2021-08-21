export interface ChatMessage {
  type: ChatMessageType;
  data: {
    usersList?: ChatDataUsersList;
    userJoin?: ChatDataUserJoin;
    userLeave?: ChatDataUserLeave;
    userDetails?: ChatDataUserDetails;
    sendMessage?: ChatDataSendMessage;
    acceptMessage?: ChatDataAcceptMessage;
  };
}

export enum ChatMessageType {
  UsersList = 'UsersList',
  UserJoin = 'UserJoin',
  UserLeave = 'UserJoin',
  UserDetails = 'UsersDetails',
  SendMessage = 'SendMessage',
  AcceptMessage = 'AcceptMessage',
}

export interface ChatDataUsersList {
  users: ChatUser[];
}

export interface ChatDataUserJoin {
  user: ChatUser;
}

export interface ChatDataUserLeave {
  user: ChatUser;
}

export interface ChatDataUserDetails {
  user: ChatUser;
}

export interface ChatDataSendMessage {
  content: string;
}

export interface ChatDataAcceptMessage {
  user: ChatUser;
  content: string;
  createdAt: Date;
}

export interface ChatUser {
  username: string;
}
