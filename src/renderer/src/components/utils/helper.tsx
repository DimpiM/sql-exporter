const uniqueId = (prefix) =>
{
    return Math.random().toString(36).replace('0.',prefix || '');
}

const Helper = {
  uniqueId
}

export default Helper;
