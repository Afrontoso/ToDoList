import styled, { css } from 'styled-components'
import { shade } from 'polished'

interface FormProps {
  hasError: boolean
}

export const Title = styled.h1`
  font-size: 48px;
  color: #3a3a3a;
  max-width: 450px;
  line-height: 56px;
  margin-top: 80px;
`

export const Form = styled.form<FormProps>`
  margin-top: 40px;
  max-width: 1000px;
  display: flex;

  input {
    flex: 1;
    height: 70px;
    padding: 0 24px;
    border: 2px solid #ddd;
    border-radius: 5px 2px 2px 5px;
    color: #3a3a3a;
    border-right: 0;
    background-color: #ddd;

    ${(props) =>
      props.hasError &&
      css`
        border-color: #c53030;
      `}

    &::placeholder {
      color: #a8a8b3;
    }
  }

  button {
    width: 160px;
    background: #04d361;
    border-radius: 0px 5px 5px 0px;
    border: 0;
    color: #fff;
    font-weight: bold;
    transition: background-color 0.2s;

    &:hover {
      background-color: ${shade(0.2, '#04d361')};
    }
  }
`

export const Issues = styled.div`
  margin-top: 80px;
  max-width: 1000px;

  div {
    background: #ddd;
    border-radius: 5px;
    width: 100%;
    min-height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s;

    &:hover {
      transform: translateX(6px);
    }

    & + div {
      margin-top: 16px;
    }

    button {
      width: 8%;
      height: 50px;
      font-weight: bold;
      color: #fff;
      background: green;
      border: 0;
      border-radius: 5px 0px 0px 5px;
      transition: background-color 0.2s;
    }

    input {
      flex: 1;
      height: 50px;
      padding: 0 24px;
      border: 2px solid #fff;
      border-radius: 5px 0px 0px 5px;
      color: #3a3a3a;
      border-right: 0;
    }

    strong {
      font-size: 20px;
      color: #3d3d4d;
      height: 100%;
      width: 100%;
      padding: 10px;
    }

    div {
      display: flex;
      max-width: 15%;

      button {
        width: 100%;
        height: 50px;
        font-weight: bold;
        color: #fff;
        background: #ffa500;
        border: 0;
        border-radius: 0px 0px 0px 0px;
        transition: background-color 0.2s;

        &:hover {
          background-color: ${shade(0.2, '#614700')};
        }

        & + button {
          border-radius: 0px 5px 5px 0px;
          background-color: #c53030;
        }

        & + button:hover {
          background-color: ${shade(0.2, '#792923')};
        }
      }
    }
  }
`

export const IssuesChecked = styled.div`
  margin-top: 40px;
  max-width: 1000px;
  border-top: solid #3a3a3a;
  padding-top: 40px;

  div {
    background: #d9d9d9;
    border-radius: 5px;
    width: 100%;
    min-height: 50px;
    display: flex;
    align-items: center;
    transition: transform 0.2s;

    &:hover {
      transform: translateX(6px);
    }

    & + div {
      margin-top: 16px;
    }

    button {
      width: 16%;
      height: 50px;
      font-weight: bold;
      color: #fff;
      background: #c53030;
      border: 0;
      border-radius: 5px 0px 0px 5px;
      transition: background-color 0.2s;

      button:hover {
        background-color: ${shade(0.2, '#792923')};
      }
    }

    strong {
      font-size: 20px;
      color: #3d3d4d;
      height: 100%;
      width: 100%;
      padding: 10px;
    }

    div {
      justify-content: end;

      button {
        width: 16%;
        height: 50px;
        font-weight: bold;
        color: #fff;
        background: #c53030;
        border: 0;
        border-radius: 0px 5px 5px 0px;
        transition: background-color 0.2s;
        background-color: #c53030;
      }

      button:hover {
        background-color: ${shade(0.2, '#792923')};
      }
    }
  }
`

export const Error = styled.span`
  display: block;
  color: #c53030;
  margin-top: 8px;
`
