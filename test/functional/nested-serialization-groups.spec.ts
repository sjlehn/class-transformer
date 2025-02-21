import { Exclude, Expose, instanceToPlain } from '../../src';

describe('serialization groups with nested classes', () => {
  it('should pass serialization groups to nested classes', () => {
    const parent = new Parent();
    parent.name = 'John Doe';
    parent.phone = '800-867-5309';

    const child = new Child();
    child.name = 'John Doe Jr';
    child.age = 2;

    parent.children = [child];

    const serialized = instanceToPlain(parent, { groups: ['parent_read'] });

    expect(serialized).toEqual({
      name: 'John Doe',
      children: [
        {
          name: 'John Doe Jr',
        },
      ],
    });
  });

  it('should handle the Github issue example', () => {
    const user = new User();
    const workspace = new Workspace();
    workspace.id = '1';
    const workspace2 = new Workspace();
    workspace2.id = '2';
    user.workspaces = [workspace, workspace2];

    const serialized = instanceToPlain(user, { groups: ['GROUP_ORGANIZATION_USERS'] });

    expect(serialized).toEqual({
      workspaces: [
        {
          id: '1',
        },
        {
          id: '2',
        },
      ],
    });
  });
});

@Exclude()
class Parent {
  @Expose({ groups: ['parent_read'] })
  name: string;

  phone: string;

  @Expose({ groups: ['parent_read'] })
  children: Child[];
}

@Exclude()
class Child {
  @Expose({ groups: ['parent_read'] })
  name: string;

  age: number;

  parent: Parent;
}

class User {
  @Expose({ groups: ['GROUP_ME', 'GROUP_ORGANIZATION_USERS'] })
  workspaces: Workspace[];
}

class Workspace {
  @Expose({
    groups: ['GROUP_WORKSPACE', 'GROUP_ORGANIZATION_WORKSPACES', 'GROUP_ORGANIZATION_USERS'],
  })
  id: string;
}
