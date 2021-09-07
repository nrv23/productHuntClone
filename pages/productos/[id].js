import React ,{useEffect,useState,useContext} from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '../../firebase/';
import Error404 from '../../components/layout/404';

import Layout from '../../components/layout/Layout';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {es} from 'date-fns/locale';
import { Campo,InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div ` 

    @media(min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p `

    padding: .5rem 2rem;
    background-color: #da552f;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
     /*display: block;toma todo el espacio que tiene la caja padre*/
     display: inline-block;/*toma solamente el espacio que ocupe el texto*/
    text-align: center;
`;

const  Producto = () => {

    //routing para obtener el id actual del producto
    const router = useRouter();
    const {query:{id}} = router;
    const { firebase, usuario } = useContext(FirebaseContext);
    const [producto, guardarProducto] = useState({});
    const [error,guardarError] = useState(false);
    const [comentario,guardarCOomentario] = useState({});
    const [consultarDB,guardarConsultarDb] = useState(true);
   //const [bloquearVoto,guardarBloquearVoto] = useState(false);
    useEffect(() => {
       if(id && consultarDB) {
        //hacer la llamada a firebase
        const obtenerProducto = async () => {

            const productoQuery = await firebase.db.collection('productos').doc(id);
            const producto = await  productoQuery.get();

            //validar que el producto exista

            if(producto.exists) {
                guardarProducto(producto.data());
                guardarConsultarDb(false);
            } else {

                guardarError(true);
                guardarConsultarDb(false);
            }
            

        }

        obtenerProducto();
       }
    }, [id]); // si el id cambia se carga la consulta
    // cuando el producto se actualice en los votos entonces carga de nuevo el effect


    if(Object.keys(producto).length === 0 && !error) return (
        
            <p as={
                css`
                    text-align: center;
                    margin-top: 5rem;
                
                ` 
            }>Cargando...</p>  
        
    )

    const {
        comentarios,
        creado,
        descripcion,
        empresa,
        nombre,
        url,
        urlimagen,
        votos,
        creador,
        votado 
    } = producto;


    const votarProducto =  () => {

      try {

        if(votado.includes(usuario.uid)) return;
        
        guardarProducto({
            ...producto,
            votado: [...votado,usuario.uid]
        });

        const hanVotado = [...votado,usuario.uid]

        const totalVotos = votos + 1;

        //actualizar enm firebase
         firebase.db.collection('productos').doc(id).update({votos: totalVotos,votado:hanVotado});

        //actualizar state


        guardarProducto({
            ...producto,
            votos: totalVotos
        });
       // guardarBloquearVoto(true);  
        guardarConsultarDb(true);
      } catch (error) {
          console.log(error)
      }
    }

    const actualizarStateComentario = ({target:{value,name}}) => {
        guardarCOomentario({
            ...comentario,
            [name]: value
        })
    }

    const agregarComentario = e => {

        e.preventDefault();

        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        const nuevosComentarios = [...comentarios,comentario];

        firebase.db.collection('productos').doc(id).update({comentarios:nuevosComentarios });

        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })
        guardarConsultarDb(true);

    }

    //saber si el usuario actual es el creador del Producto
    const creadorProducto = id => creador.id === id;

    //eliminar un producto

    const eliminarProducto = async () => {

        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
        } catch (error) {
            console.log(error)
        }

    }
    return ( 

        
        <Layout>  
            <>

                {
                    error ? <Error404 /> :
                    <div className="contenedor">
                    <h1 css={
                        css`
                            text-align: center;
                            margin-top: 5rem;
                        
                        ` 
                    }>
                        {nombre}
                    </h1>
                    <ContenedorProducto>
                        <div>
                            <p>Publicado hace: {formatDistanceToNow(new Date(creado),{locale: es})}</p>
                            <img src={urlimagen} alt="" />
                            <p>{descripcion}</p>
                            <p>Por: {creador.nombre} de {empresa}</p>
                            {
                                usuario && <>
                                    <h2>Agrega tu comentario</h2>

                                        <form
                                         onSubmit = {agregarComentario}
                                        >
                                            <Campo>

                                                <input 
                                                    type="text" 
                                                    name="mensaje" 
                                                    id="mensaje"
                                                    onChange={actualizarStateComentario}
                                                />
                                            </Campo>
                                            <InputSubmit 
                                                type="submit"
                                                value="Agregar comentario"
                                            />
                                        </form>

                                    </>
                            }

                            <h2
                                css={
                                    css`
                                        margin: 2rem 0;
                                    `
                                }
                            >Comentarios</h2>

                            {
                                comentarios.length=== 0 ? 'Aún no hay comentarios':
                                (
                                    <ul>
                                        {
                                            comentarios.map((comentario,id) => {
                                                return <li
                                                        key={
                                                            id
                                                        }
                                                        css={css`
                                                            border: 1px solid #e1e1e1;
                                                            padding: 2rem;
                                                        `}
                                                    >
                                                    <p>{comentario.mensaje}</p>
                                                    <p>Escrito por: 
                                                        <span
                                                            css={css`
                                                                font-weight: bold;
                                                            `}
                                                        >
                                                        {' '}{comentario.usuarioNombre}
                                                        </span>
                                                    </p>
                                                    {
                                                        creadorProducto(comentario.usuarioId) && 
                                                        <CreadorProducto>Es creador</CreadorProducto>
                                                    }
                                                </li>
                                            })
                                        }
                                    </ul>
                                )
                            }
                        </div>
                        <aside>
                            <Boton 
                                target="_blank"
                                bgColor="true"
                                href={url}
                                //disabled={bloquearVoto}
                            >
                                Visitar URL
                            </Boton>
                            
                            
                            <div
                                css={css`
                                    margin-top: 5rem;
                                `}
                            >
                                {
                                    usuario && <>
                                        <Boton
                                            onClick={votarProducto}
                                        >
                                            Votar
                                        </Boton>

                                        <p css={css`
                                            text-align: center;
                                        `}>Votos: {votos}</p>
                                    </>
                                }
                                
                            </div>
                        </aside>
                    </ContenedorProducto>
                    {
                        usuario && creadorProducto(usuario.uid) ? ( <Boton
                            onClick={eliminarProducto}
                        >
                            EliminarProducto
                        </Boton>)
                    : null
                    }
                </div>
                }

                
            </>

        </Layout>
    
        
      );
}
 
export default Producto ;