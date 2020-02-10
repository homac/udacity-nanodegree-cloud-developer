import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'

import { Form } from 'react-bootstrap'

import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'


import { createEntry, deleteEntry, getEntries, patchEntry } from '../api/journal-api'
import Auth from '../auth/Auth'
import { Entry } from '../types/Entry'

interface EntriesProps {
  auth: Auth
  history: History
}

interface EntriesState {
  entries: Entry[]
  newEntryTitle: string
  newEntryDescription: string
  loadingEntries: boolean
}

export class Entries extends React.PureComponent<EntriesProps, EntriesState> {
  state: EntriesState = {
    entries: [],
    newEntryTitle: '',
    newEntryDescription: '',
    loadingEntries: true
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newEntryTitle: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newEntryDescription: event.target.value })
  }

  onEditButtonClick = (entryId: string) => {
    this.props.history.push(`/entries/${entryId}/edit`)
  }

  onEntryCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newEntry = await createEntry(this.props.auth.getIdToken(), {
        title: this.state.newEntryTitle,
        description: this.state.newEntryDescription,
        dueDate
      })
      this.setState({
        entries: [...this.state.entries, newEntry],
        newEntryTitle: '',
        newEntryDescription: ''
      })
    } catch {
      alert('Journal entry creation failed')
    }
  }

  onEntryDelete = async (entryId: string) => {
    try {
      await deleteEntry(this.props.auth.getIdToken(), entryId)
      this.setState({
        entries: this.state.entries.filter(entry => entry.entryId != entryId)
      })
    } catch {
      alert('Journal entry deletion failed')
    }
  }

  onEntryCheck = async (pos: number) => {
    try {
      const entry = this.state.entries[pos]
      await patchEntry(this.props.auth.getIdToken(), entry.entryId, {
        title: entry.title,
        description: entry.description,
        dueDate: entry.dueDate,
        done: !entry.done
      })
      this.setState({
        entries: update(this.state.entries, {
          [pos]: { done: { $set: !entry.done } }
        })
      })
    } catch {
      alert('Journal entry deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const entries = await getEntries(this.props.auth.getIdToken())
      this.setState({
        entries,
        loadingEntries: false
      })
    } catch (e) {
      alert(`Failed to fetch entries: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
      <p>&nbsp;</p>
      <Header as="h1">Create New Journal Entry</Header>
        {this.renderCreateEntryInput()}

        <p>&nbsp;</p>
        <Header as="h1">Journal Entries</Header>

        {this.renderEntries()}
      </div>
    )
  }

  renderCreateEntryInput() {
    return (
      <div>
          <Form.Group>
            <Form.Label placeholder="A day in my life..."><b>Title</b></Form.Label>
            <Form.Control onChange={this.handleTitleChange}/>
            <Form.Label placeholder="A day in my life..."><b>Description</b></Form.Label>
            <Form.Control as="textarea" rows="3" onChange={this.handleDescriptionChange}/>
            <p>&nbsp;</p>
            <Button align="right" onClick={this.onEntryCreate}>Add</Button>
              <Divider />
          </Form.Group>
      </div>
    )
  }

  renderEntries() {
    if (this.state.loadingEntries) {
      return this.renderLoading()
    }

    return this.renderEntriesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading entries
        </Loader>
      </Grid.Row>
    )
  }

  renderEntriesList() {
    return (
      <Grid padded>
        {this.state.entries.map((entry, pos) => {
          return (
            <Grid.Row key={entry.entryId}>
              <Grid.Column width={10} verticalAlign="middle">
                <b>{entry.title}</b>
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                <pre>{entry.description}</pre>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {entry.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(entry.entryId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onEntryDelete(entry.entryId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {entry.attachmentUrl && (
                <Image src={entry.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
