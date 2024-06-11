import { Tag as Container } from "./styles";

export function Tag({ title, ...rest }) {
  return (
    <Container {...rest}>
      {title}
    </Container>
  )
}