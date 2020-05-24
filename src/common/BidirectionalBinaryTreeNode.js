import BinaryTreeNode from "./BinaryTreeNode";

class BidirectionalBinaryTreeNode extends BinaryTreeNode {
  constructor(val, left, right, parent = null) {
    super(val, left, right);
    this.parent = parent;
  }
}

export default BidirectionalBinaryTreeNode;
