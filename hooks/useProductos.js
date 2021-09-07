import React,{useState,useContext,useEffect} from 'react';
import { FirebaseContext } from '../firebase';


const useProductos = orden => {

    const [productos,guardarProdutos] = useState([]);
    const {firebase} = useContext(FirebaseContext);

    useEffect(() => {
        console.log("hola")
        const obtenerProductos = () =>{
        firebase.db.collection('productos')
        .orderBy(orden,'desc').onSnapshot(manejarSnapshot);
        }

        obtenerProductos();

    }, []);

    function manejarSnapshot(snapshot) {
        const productos = snapshot.docs.map(doc => {

        return {
            id: doc.id,
            ...doc.data() // una copia de cada documento 
        }
        });

        guardarProdutos(productos)
    }

    return {
        productos
    }
}

export default useProductos;