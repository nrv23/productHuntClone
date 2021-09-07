import styled from '@emotion/styled';
import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {es} from 'date-fns/locale'; // iomportar a español la fecha
import Link from 'next/dist/client/link';

const Li = styled.li `
    padding: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e1e1e1;

`;
const Img = styled.img`

    width: 200px;

`;

const DescripcionProducto = styled.div `
    flex: 0 1 600px;
    display: grid;
    grid-template-columns: 1fr 3fr;
    column-gap: 2rem;

`;

const Comentarios = styled.div `

    margin-top: 2rem;
    display: flex;
    align-items: center;

    div {
        display: flex;
        align-items: center;
        border: 1px solid #e1e1e1;
        padding: .3rem 1rem;
        margin-right: 2rem;
    }

    img {
        width: 2rem;
        margin-right: 2rem;
    }

    p {
        font-size: 1.6rem;
        margin-right: 1rem;
        font-weight: 700;
        &::last-of-type {
            margin: 0;
        }
    }
`;

const Votos = styled.div `

    flex: 0 0 auto;
    text-align: center;
    border: 1px solid #e1e1e1;
    padding: 1rem 3rem;
    div {
        font-size: 2rem;
    } 

    p {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
    }

`;

const Titlo = styled.a`

    font-size: 2rem;
    font-weight: bold;
    margin: 0;
    :hover {
        cursor: pointer;
    }
`;

const TextoDescripcion = styled.p`

    font-size: 1.6rem;
    margin: 0;
    color: #888;
`;

const DetallesProducto = ({producto}) => {

    const {
        id,
        comentarios,
        creado,
        descripcion,
        empresa,
        nombre,
        url,
        urlimagen,
        votos 
    } = producto;

    return (
        <Li>
            <DescripcionProducto>
                <div>
                    <Img src={urlimagen} alt={`${urlimagen}`} />
                </div>
                <div>
                    <Link href="/productos/[id]" as={`/productos/${id}`}>
                        <Titlo>{nombre}</Titlo>
                    </Link>
                    <p>{descripcion}</p>
                    <Comentarios>
                        <div>
                            <img src="/static/img/comentario.png" />
                            <TextoDescripcion>{comentarios.length} Comentarios</TextoDescripcion>
                        </div>
                    </Comentarios>
                    <p>Publicado hace:&nbsp;&nbsp; { formatDistanceToNow(new Date(creado),{locale: es})} </p>
                </div>
            </DescripcionProducto>
            {/**---------------- */}
            <Votos>
                <div>&#9650;</div>
                <p>{votos}</p>
            </Votos>
        </Li> 
    );
}
 
export default DetallesProducto;