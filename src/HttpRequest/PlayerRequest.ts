import axios from 'axios';
import { useQuery } from "react-query";
import { castObjectAsParam } from '../core/dataHelper';


export interface Adresse {
    id?: number,
    rue: string,
    playerId?: number
};

export interface Player {
    id: number,
    pseudo: string,
    age?: number,
    birthDate: Date,
    addresses: Adresse[];
}

export interface PlayerCriteria {
    isActive: boolean | null,
    filterText: string | null,
    maxAge: number | null
};


export interface PlayerRequest {
    id?: number
    pseudo: string,
    birthDate: Date | null,
    addresses: Adresse[];
};

export const fetchPlayer = async (id: number) => {
    console.log("execute code")
    const response = await axios.get<Player>((`http://localhost:5094/api/player/${id}`));
    return response.data;
};

export const GetPlayerById = (id: number) => {
    const { data, isLoading, refetch, isRefetching } = useQuery(
        [(`player/${id}`), id],
        () => fetchPlayer(id),
        { enabled: true, staleTime: Infinity }
    );
    return { data, isLoading, refetch, isRefetching };
};

export const GetPlayerByCriteria = async (criteria: PlayerCriteria) => {

    const response = await axios.post<Player[]>('http://localhost:5094/api/player/by-criteria', criteria);
    return response.data;
}

export const PostPlayer = async (player: PlayerRequest) => {
    console.log("PostPlayer", player);
    let response = await axios.post<Player>('http://localhost:5094/api/player/Add-Player', player);
    return response.data;
}


export const DeletePlayer = async (player: PlayerRequest) => {
    const response = await axios.post<Player>(`http://localhost:5094/api/player/Delete-Player`, castObjectAsParam(player));
    return response.data;
}

export const DeleteAdresse = async (Adresse: Adresse) => {
    const response = await axios.post<Adresse>(`http://localhost:5094/api/player/Delete-Addresse`, castObjectAsParam(Adresse));
    return response.data;
}

export const UpdatePlayer = async (player: PlayerRequest) => {
    const response = await axios.put<Player>(`http://localhost:5094/api/player/Update`, castObjectAsParam(player));
    return response.data;
}
