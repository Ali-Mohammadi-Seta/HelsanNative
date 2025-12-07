import moment from 'moment-jalaali';

interface Privilege {
  _id: string;
  enName: string;
  faName: string;
  key: string;
  isRoot: boolean;
}

interface PrivilegeTreeNode extends Privilege {
  title: string;
  children: PrivilegeTreeNode[];
}

export const privilegeTree = (
  privilegeList: Privilege[]
): PrivilegeTreeNode[] => {
  // Filter root privileges and non-root privileges.
  const roots = privilegeList.filter((item) => item.isRoot);
  const nonRoots = privilegeList.filter((item) => !item.isRoot);

  // Map non-root items to include the title property and an empty children array.
  const children: PrivilegeTreeNode[] = nonRoots.map((obj) => ({
    ...obj,
    title: obj.faName,
    children: [],
  }));

  // Construct the tree by associating each root with its children.
  const result: PrivilegeTreeNode[] = roots.map((root) => ({
    ...root,
    title: root.faName,
    children: children.filter(
      (child) => child.key.charAt(0) === root.key.charAt(0)
    ),
  }));

  return result;
};

export const calculateAge = (birthYear: number): number => {
  const today = moment();
  const birthday = moment(`${birthYear}-01-01`, 'jYYYY-jMM-jDD');
  return today.jYear() - birthday.jYear();
};
