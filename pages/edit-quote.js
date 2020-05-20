import {
  Banner,
  Card,
  DisplayText,
  Form,
  FormLayout,
  Frame,
  Layout,
  Page,
  PageActions,
  TextField,
  Toast,
  Link,
} from '@shopify/polaris';
import store from 'store-js';
import gql from 'graphql-tag';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';
import { Mutation } from 'react-apollo';

const UPDATE_QUOTE = gql`
 mutation draftOrderUpdate($id: ID!, $input: DraftOrderInput!) {
   draftOrderUpdate(id: $id, input: $input) {
    draftOrder {
      id
    }
    userErrors {
      field
      message
    }
   }
 }
`;

class EditQuote extends React.Component {
  state = {
    showToast: true,
    id: '',
    name: '',
    email: '',
    status: 'OPEN',
    note: '',
    tags: '',
    lineItems: [],
  };

  componentDidMount() {
    const {id, name, email, status, note, tags, lineItems} = this.itemToBeConsumed()
    this.setState({ 
      id, name, email, status, note, tags, lineItems
    });
  }

  

  duplicateQuote() {
    console.log('duplicate this quote');
  }

  addCustomItem() {
    console.log('add custom item');
  }

  deleteDraftOrder() {
    console.log('delete draft order');
  }

  toggleToast() {
    const { showToast } = this.state;
    console.log('arrive toggle');
    this.setState({ showToast: !showToast });
  }

  renderToast() {
    const toastDuration = 2500;
    const { showToast } = this.state;
    return showToast ? (<Toast content="Sucessfully updated" duration={{ toastDuration }} onDismiss={() => this.toggleToast() } />) : null;
  }

  render() {
    const { showToast, id, name, email, status, note, tags, lineItems } = this.state;
    const app = this.context;
    const redirectToQuoteList = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.APP,
        '/',
      );
    };

    return (
      <Mutation
        mutation={UPDATE_QUOTE}
      >
        {(handleSubmit, { error, data }) => {
          const errorMarkup = error && (
            <Banner status="critical">{error.message}</Banner>
          );
          console.log('showToast: ', showToast);
          const toastMarkup = (data && data.draftOrderUpdate) ? this.renderToast() : null;
          
          return (
            <Frame>
              <Page>
                <Layout>
                  {toastMarkup}
                  <Layout.Section>
                    {errorMarkup}
                  </Layout.Section>
                  <Layout.Section>
                    <Link onClick={() => redirectToQuoteList()}>&larr; Quotes</Link>
                    <Link onClick={() => duplicateQuote()}>Duplicate</Link>
                    <DisplayText size="large">{name}</DisplayText>
                    <Form>
                      <Card
                        title="Quote details"
                        actions={[
                          {
                            content: 'Add custom item',
                            onAction: () => addCustomItem()
                          }
                        ]}
                        sectioned
                      >
                        <FormLayout>
                          <FormLayout.Group>
                            <TextField
                              value={note}
                              onChange={this.handleChange('note')}
                              label="Note"
                              type="string"
                            />
                            <TextField
                              value={tags}
                              onChange={this.handleChange('tags')}
                              label="Tags"
                              type="tag"
                            />
                          </FormLayout.Group>
                          <p>
                            This sale price will expire in two weeks
                          </p>
                        </FormLayout>
                      </Card>
                      <PageActions
                        primaryAction={[
                          {
                            content: 'Save draft quote',
                            onAction: () => {
                              const draftOrderInput = {
                                note: this.state.note,
                                tags: this.state.tags,
                              };
                              handleSubmit({
                                variables: { id: 'gid://shopify/DraftOrder/' + id, input: draftOrderInput },
                              });
                            },
                          },
                        ]}
                        secondaryActions={[
                          {
                            content: 'Delete draft quote',
                            onAction: () => {
                              deleteDraftOrder();
                            }
                          },
                        ]}
                      />
                    </Form>
                  </Layout.Section>
                </Layout>
              </Page>
            </Frame>
          );
        }}
      </Mutation>
    );
  }

  handleChange = (field) => {
    return (value) => this.setState({ [field]: value });
  };

  itemToBeConsumed = () => {
    const quote = store.get('quote-item');
    // const price = quote.variants.edges[0].node.price;
    // const variantId = quote.variants.edges[0].node.id;
    // const discounter = price * 0.1;
    // this.setState({ price, variantId });
    return quote
  };
}

export default EditQuote;
