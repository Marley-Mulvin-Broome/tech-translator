import { setUserToken } from "./login";
import { CardContainer, CardContainerCreatedResponse, CardContainerList, CreateSentenceCardModel, CreateTangoCardModel, LoginResponse, OkResponse, RssFeedEntriesModel, RssFetchRequest, SentenceCard, SettableCardField, TangoCard } from "./models";
import { SERVER_URL } from "./serverConfig";

/**
 * 
 * @param path サーバーのパス
 * @param token トークン
 * @param headers ヘッダー
 * @param params 
 * @param body 
 * @param method 
 * @returns 
 */
export const makeAuthenticatedRequest = async (path: string, token: string, headers: object, params: URLSearchParams | undefined, body: object | undefined, method: string): Promise<any> => {

  let targetPath = SERVER_URL + '/' +  path;

  if (params !== undefined) {
    targetPath += '?' + params.toString();
  }

  const response = await fetch(targetPath,{
    method: method,
    headers: {
      'X-Token': token,
      'Content-Type': 'application/json',
      ...headers
    },
    redirect: 'follow',
    body: body ? JSON.stringify(body) : undefined,
  });
  

  if (response.status === 401) {
    const refreshResult = await refreshAccessToken(token);

    // TODO: くそおおーーーー
    setUserToken(refreshResult.token, refreshResult.refreshToken);

    return makeAuthenticatedRequest(path, refreshResult.token, headers, params, body, method);
  }

  if (response.status === 400) {
    throw new Error('不正なリクエストです');
  }

  if (response.status === 404) {
    throw new Error('リソースが見つかりません');
  }

  if (response.status === 500) {
    throw new Error('サーバーエラーが発生しました');
  }

  if (response.status !== 200) {
    throw new Error('不明なエラーが発生しました');
  }

  return response.json();
}

export const refreshAccessToken = async (refreshToken: string) => {
  const response = await fetch(`${SERVER_URL}/users/refresh`, {
    method: 'POST',
    headers: {
      'X-Refresh-Token': refreshToken
    }
  });

  if (response.status === 400) {
    throw new Error('リフレッシュトークンが不正です');
  }

  const { token, refresh_token } = await response.json();
  return {token, refreshToken: refresh_token};
}


export const signUpRequest = async (email: string, password: string) => {
  const response = await fetch(`${SERVER_URL}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (response.status === 400) {
    throw new Error('メールアドレスまたはパスワードが不正です');
  }

  const { token, refreshToken } = await response.json();
  return { token, refreshToken };
};


export const loginRequest = async (email: string, password: string): Promise<LoginResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.set('email', email);

  const response = await fetch(`${SERVER_URL}/users/login?${queryParams.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'password': password
    },
  });

  if (response.status === 400) {
    throw new Error('メールアドレスまたはパスワードが違います');
  }

  if (response.status !== 200) {
    throw new Error('不明なエラーが発生しました');
  }

  return response.json();
};

export const signoutRequest = async (token: string) => {
  await fetch(`${SERVER_URL}/users/signout`, {
    method: 'POST',
    headers: {
      'X-Token': token
    }
  });
};

export const deleteRequest = async (token: string) => {
  await fetch(`${SERVER_URL}/users`, {
    method: 'DELETE',
    headers: {
      'X-Token': token
    }
  });
};

export const getAllCardCollectionsRequest = async (token: string) => {
  return makeAuthenticatedRequest('cards', token, {}, undefined, undefined, 'GET') as Promise<CardContainerList>;
};

export const getCollectionWithIdRequest = async (token: string, collectionId: string) => {
  return makeAuthenticatedRequest(`cards/${collectionId}`, token, {}, undefined, undefined, 'GET') as Promise<CardContainer>;
};

export const getAllCardsInCollectionRequest = async<T extends TangoCard[] | SentenceCard[]> (token: string, collectionId: string) => {
  return makeAuthenticatedRequest(`cards/${collectionId}/cards`, token, {}, undefined, undefined, 'GET') as Promise<T>;
}

export const createCardCollectionWithNameRequest = async (token: string, name: string, is_sentence = false) => {
  const queryParams = new URLSearchParams();
  queryParams.set('name', name);
  queryParams.set('is_sentence', is_sentence.toString());

  return makeAuthenticatedRequest('cards/create_card_collection', token, {}, queryParams, undefined, 'POST') as Promise<CardContainerCreatedResponse>;
};

export const getSentenceCardRequest = async (token: string, collectionId: string, cardId: string) => {
  return makeAuthenticatedRequest(`cards/sentence_card_get/${collectionId}/${cardId}`, token, {}, undefined, undefined, 'GET') as Promise<SentenceCard>;
};

export const getTangoCardRequest = async (token: string, collectionId: string, cardId: string) => {
  return makeAuthenticatedRequest(`cards/tango_card_get/${collectionId}/${cardId}`, token, {}, undefined, undefined, 'GET') as Promise<TangoCard>;
};

export const setTangoCardRequest = async (token: string, collectionId: string, newCard: TangoCard) => {
  return makeAuthenticatedRequest(`cards/tango_card_set/${collectionId}`, token, {}, undefined, newCard, 'PATCH');
};

export const setSentenceCardRequest = async (token: string, collectionId: string, newCard: SentenceCard) => {
  return makeAuthenticatedRequest(`cards/sentence_card_set/${collectionId}`, token, {}, undefined, newCard, 'PATCH') as Promise<SentenceCard>;
};

export const updateCardCollectionFieldRequest = async (token: string, collectionId: string, fieldName: "name", fieldValue: string) => {
  const queryParams = new URLSearchParams();
  queryParams.set('field_name', fieldName);
  queryParams.set('field_value', fieldValue);

  return makeAuthenticatedRequest(`cards/update_card_collection_field/${collectionId}`, token, {}, queryParams, undefined, 'PATCH') as Promise<OkResponse>;
};

export const updateCardFieldRequest = async (token: string, collectionId: string, cardId: string, fieldName: SettableCardField, fieldValue: string | number | boolean) => {
  const queryParams = new URLSearchParams();
  queryParams.set('field_name', fieldName);
  queryParams.set('field_value', fieldValue.toString());

  return makeAuthenticatedRequest(`cards/update_card_field/${collectionId}/${cardId}`, token, {}, queryParams, undefined, 'PATCH') as Promise<OkResponse>;
};

export const addTangoCardToCollectionRequest = async (token: string, collectionId: string, newCard: CreateTangoCardModel) => {
  return makeAuthenticatedRequest(`cards/add_tango_card_to_collection/${collectionId}`, token, {}, undefined, newCard, 'POST') as Promise<TangoCard>;
};

export const addSentenceCardToCollectionRequest = async (token: string, collectionId: string, newCard: CreateSentenceCardModel) => {
  return makeAuthenticatedRequest(`cards/add_sentence_card_to_collection/${collectionId}`, token, {}, undefined, newCard, 'POST') as Promise<SentenceCard>;
};

export const deleteCardCollectionRequest = async (token: string, collectionId: string) => {
  return makeAuthenticatedRequest(`cards/delete_card_collection/${collectionId}`, token, {}, undefined, undefined, 'DELETE') as Promise<OkResponse>;
};

export const deleteCardRequest = async (token: string, collectionId: string, cardId: string) => {
  return makeAuthenticatedRequest(`cards/delete_card/${collectionId}/${cardId}`, token, {}, undefined, undefined, 'DELETE') as Promise<OkResponse>;
};

export const getAllTodoCardsCountInCollectionRequest = async (token: string, collectionId: string) => {
  return makeAuthenticatedRequest(`cards/${collectionId}/todo_count`, token, {}, undefined, undefined, 'GET') as Promise<number>;
};

export const getRssRequest = async (token: string, request: RssFetchRequest) => {
  return makeAuthenticatedRequest('rss/', token, {}, undefined, request, 'POST') as Promise<RssFeedEntriesModel[]>;
};