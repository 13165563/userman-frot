// src/access.ts
export default function access(initialState: { currentUser?: API.User } | undefined) {
  const { currentUser } = initialState ?? {};

  // 生产环境移除调试代码
  const debugInfo = process.env.NODE_ENV === 'development' ? {
    _debug: {
      rawData: currentUser,
      timestamp: Date.now()
    }
  } : {};

  return {
    // 严格类型检查
    isLoggedIn: !!currentUser?.id,
    canAdmin: currentUser?.role === 1, // 直接比较，避免类型转换问题
    ...debugInfo
  };
}
