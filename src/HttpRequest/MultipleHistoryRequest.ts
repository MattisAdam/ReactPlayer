import axios from 'axios';


export interface MultiPleHistory{
    id? : number,
    date : Date,
    multiple : number
}

export const  PostMultiple = async(multiple : number, id? : number): Promise <MultiPleHistory> => {
    const data: MultiPleHistory ={
        id : id,
        date : new Date,
        multiple : multiple
    }
    console.log("Données envoyées :", data);
    const response = await axios.post<MultiPleHistory>('http://localhost:5094/api/MultipleHistory/Add-MultipleHistory', data);
    
    return response.data
}