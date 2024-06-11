/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Container, Links, Content } from "./styles"
import { Button } from "../../components/button"
import { Header } from "../../components/header"
import { Section } from "../../components/section"
import { Tag } from '../../components/tag'
import { ButtonText } from '../../components/button_text'
import { api } from "../../services/api"
 
export function Details(){
  const [data, setData] = useState(null)

  const navigate = useNavigate()
  const params = useParams()

  function handleBack() {
    navigate(-1)
  }

  async function handleConfirm() {
    const confirm = window.confirm('Deseja realmente remover essa nota?')

    if(confirm) {
      await api.delete(`/notes/${params.id}`)
      navigate(-1)
    }
  }

  useEffect(() => {
    async function fetchNote() {
      const res = await api.get(`/notes/${params.id}`)
      setData(res.data)
    }

    fetchNote()
  }, [])

  return(
    <Container>
      <Header />
      {
        data &&
        <main>
          <Content>
            <ButtonText 
              title='Excluir Nota'
              onClick={handleConfirm}
            />

            <h1>{data.title}</h1>
            <p>{data.description}</p>
            
            <Section title='Links uteis'>
              {
                data.links &&
                  <Links>
                {
                  data.links.map(link => (
                  <li key={String(link.id)}>
                    <a href={link.url} target="_blank">
                      {link.url}
                    </a>
                  </li>
                  ))
                }
                </Links>
              }
            </Section>

            {
              data.tags && 
              <Section title='Marcadores'>
                {
                  data.tags.map(tag => (
                   <Tag
                      key={String(tag.id)}
                      title={tag.name}
                   />
                  ))
                }
                </Section>
            }
            <Button 
              title='Voltar' 
              onClick={handleBack}
            />
          </Content>
        </main>
      }
  </Container>
  )
}