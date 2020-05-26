import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Card,
  ResourceList,
  ResourceItem,
  Stack,
  TextStyle,
  Badge,
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';
// import Link from 'next/link';

const GET_DRAFTORDER_LIST_OPEN = gql`{
  draftOrders(first: 10, query:"status:open") {
    edges {
      node {
        id
        name
        createdAt
        completedAt
        email
        customer {
          displayName
          email
          firstName
          lastName
        }
        status
        totalPrice
        note2
        tags
        lineItems(first: 10) {
          edges {
            node {
              custom
              discountedTotal
              discountedUnitPrice
              originalTotal
              originalUnitPrice
              id
              quantity
              product {
                handle
                featuredImage {
                  originalSrc
                }
                title
              }
            }
          }
        }
      }
    }
  }
}`;
const GET_DRAFTORDER_LIST_COMPLETED = gql`{
  draftOrders(first: 10, query:"status:completed") {
    edges {
      node {
        id
        name
        createdAt
        completedAt
        email
        customer {
          displayName
          email
          firstName
          lastName
        }
        status
        totalPrice
        note2
        tags
      }
    }
  }
}`;
const GET_DRAFTORDER_LIST_INVOCESENT = gql`{
  draftOrders(first: 10, query:"status:invoice_sent") {
    edges {
      node {
        id
        name
        createdAt
        completedAt
        email
        customer {
          displayName
          email
          firstName
          lastName
        }
        status
        totalPrice
        note2
        tags
      }
    }
  }
}`;

class ResourceListWithDraftorders extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      classify: 'all',
      selectedDraftorders: [],
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      classify: props.classify
    }
  }

  setSelectedDraftorders = (draftOrders) => {
    this.setState({
      selectedDraftorders: draftOrders
    });
  }
  
  static contextType = Context;

  render() {
    const app = this.context;
    const redirectToQuote = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.APP,
        '/edit-quote',
      );
    };
    let queryString = GET_DRAFTORDER_LIST_OPEN
    switch(this.state.classify) {
      case 'completed':
        queryString = GET_DRAFTORDER_LIST_COMPLETED
        break;
      case 'invoice_sent':
        queryString = GET_DRAFTORDER_LIST_INVOCESENT
        break;
      default:
        queryString = GET_DRAFTORDER_LIST_OPEN
    }

    return (
      <Query query={queryString}>
        {({ data, loading, error }) => {
          if (loading) { return <div>Loading…</div>; }
          if (error) { return <div>{error.message}</div>; }
          console.log('draft order list: ', data.draftOrders.edges);
          const renderItems = data.draftOrders.edges.map(doItem => {
            return {
              id: parseInt(doItem.node.id.split('/').slice(-1).pop()),
              name: doItem.node.name,
              createdAt: doItem.node.createdAt,
              completedAt: doItem.node.completedAt,
              email: doItem.node.email,
              customer: doItem.node.customer,
              status: doItem.node.status,
              totalPrice: doItem.node.totalPrice,
              note: doItem.node.note2,
              tags: doItem.node.tags.join(','),
              lineItems: doItem.node.lineItems,
            }
          });
          
          const bulkActions = [
            {
              content: 'Add tags',
              onAction: () => console.log('Todo: implement bulk add tags'),
            },
            {
              content: 'Remove tags',
              onAction: () => console.log('Todo: implement bulk remove tags'),
            },
            {
              content: 'Delete customers',
              onAction: () => console.log('Todo: implement bulk delete'),
            },
          ];
          
          return (
            <Card>
              <ResourceList
                resourceName={{ singular: 'Draftorder', plural: 'Draftorders' }}
                items={renderItems}
                renderItem={renderItem}
                selectedItems={this.state.selectedDraftorders}
                onSelectionChange={this.setSelectedDraftorders}
                bulkActions={bulkActions}
              />
            </Card>
          );
          function renderItem(item, _, index) {
            const {id, name, createdAt, completedAt, email, customer, status, totalPrice, lineItems} = item;
            const customerName = customer ? customer.firstName : ' _ '
            return (
              <ResourceItem
                id={id}
                // url={`edit-quote/${id}`}
                sortOrder={index}
                accessibilityLabel={`View details for ${name}`}
                onClick={() => {
                  store.set('quote-item', item);
                  redirectToQuote();
                }}
              >
                <Stack>
                  <Stack.Item fill>
                    <h3>
                      <TextStyle variation="strong">
                        {name}
                      </TextStyle>
                    </h3>
                  </Stack.Item>
                  <Stack.Item fill>
                    <p>{createdAt}</p>
                  </Stack.Item>
                  <Stack.Item fill>
                    <p>Displays4Sale</p>
                  </Stack.Item>
                  <Stack.Item fill>
                    <p>{customerName} </p>
                  </Stack.Item>
                  <Stack.Item fill>
                    <Badge>{ status }</Badge>
                  </Stack.Item>
                  <Stack.Item fill>
                    <p>${ totalPrice }</p>
                  </Stack.Item>
                </Stack>
              </ResourceItem>
            );
          };
          function resolveItemIds({id}) {
            return id.split('/').slice(-1).pop();
          }
        }}
      </Query>
    );
  }
}

export default ResourceListWithDraftorders;
