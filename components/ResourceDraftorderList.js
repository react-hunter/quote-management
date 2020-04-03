import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Card,
  ResourceList,
  ResourceItem,
  Stack,
  TextStyle,
  Thumbnail,
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

const GET_DRAFTORDER_LIST = gql`{
  draftOrders(first: 10) {
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

  setSelectedDraftorders = (draftOrders) => {
    this.setState({
      selectedDraftorders: draftOrders
    });
  }
  
  static contextType = Context;

  render() {
    const app = this.context;
    const redirectToDraftorder = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.APP,
        '/edit-products',
      );
    };

    return (
      <Query query={GET_DRAFTORDER_LIST}>
        {({ data, loading, error }) => {
          if (loading) { return <div>Loading…</div>; }
          if (error) { return <div>{error.message}</div>; }
          const renderItems = data.draftOrders.edges.map(doItem => {
            return {
              id: parseInt(doItem.node.id.split('/').slice(-1).pop()),
              name: doItem.node.name,
              createdAt: doItem.node.createdAt,
              completedAt: doItem.node.completedAt,
              email: doItem.node.email,
              customer: doItem.node.customer,
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
            const {id, name, createdAt, completedAt, email, customer} = item;
            const customerName = customer ? customer.firstName : ' _ '
            return (
              <ResourceItem
                id={id}
                url={`edit-quote/${id}`}
                sortOrder={index}
                accessibilityLabel={`View details for ${name}`}
              >
                <Stack>
                  <Stack.Item fill>
                    <h3>
                      <TextStyle variation="strong">
                        {name}
                      </TextStyle>
                    </h3>
                  </Stack.Item>
                  <Stack.Item>
                    <p>{createdAt}</p>
                  </Stack.Item>
                  <Stack.Item>
                    <p>{customerName} </p>
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
