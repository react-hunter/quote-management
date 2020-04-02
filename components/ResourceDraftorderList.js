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
      }
    }
  }
}`;

class ResourceListWithDraftorders extends React.Component {
  state = {
    selectedDraftorders: [],
  };
  setSelectedDraftorders = (draftOrders) => {
    console.log('selected: ', draftOrders);
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

    // const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();
    return (
      <Query query={GET_DRAFTORDER_LIST}>
        {({ data, loading, error }) => {
          if (loading) { return <div>Loading…</div>; }
          if (error) { return <div>{error.message}</div>; }
          console.log('draft orders loading: ', data.draftOrders.edges)
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

          const resolveItemIds = ({id}) => {
            return id;
          };

          return (
            <Card>
              <ResourceList
                resourceName={{ singular: 'Draftorder', plural: 'Draftorders' }}
                items={data.draftOrders.edges}
                renderItem={(item) => {
                  const customerName = item.node.customer ? item.node.customer.firstName : ''
                  const itemId = item.node.id.split('/').slice(-1).pop()
                  console.log('item id: ', itemId)
                  return (
                    <ResourceItem
                      id={itemId}
                      name={item.node.name}
                      accessibilityLabel={`View details for ${item.node.name}`}
                      onClick={() => {
                        store.set('item', item.node);
                        redirectToDraftorder();
                      }
                      }
                    >
                      <Stack>
                        <Stack.Item fill>
                          <h3>
                            <TextStyle variation="strong">
                              {item.node.name}
                            </TextStyle>
                          </h3>
                        </Stack.Item>
                        <Stack.Item>
                          <p>{item.node.createdAt}</p>
                        </Stack.Item>
                        <Stack.Item>
                          <p>{customerName} </p>
                        </Stack.Item>
                      </Stack>
                    </ResourceItem>
                  );
                }}
                selectedItems={this.selectedDraftorders}
                onSelectionChange={this.setSelectedDraftorders}
                selectable
                bulkActions={bulkActions}
                resolveItemId={resolveItemIds}
              />
            </Card>
          );
        }}
      </Query>
    );
  }
}

export default ResourceListWithDraftorders;
