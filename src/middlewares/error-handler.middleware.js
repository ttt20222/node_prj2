export default function (err, req, res, next) {
    console.error(err);
  
    if (err.name === 'ValidationError') {
        let errorMessage;
        switch(err.message) {
            case '"email" must be a valid email':
                errorMessage = '이메일 형식이 올바르지 않습니다.';
                break;
            case '"name" is required':
                errorMessage = '이름을 입력해 주세요.';
                break;
            case '"email" is required':
                errorMessage = '이메일을 입력해 주세요.';
                break;
            case '"password" is required':
                errorMessage = '비밀번호를 입력해 주세요.';
                break;
            case '"passwordConfirm" is required':
                errorMessage = '확인 비밀번호를 입력해 주세요.';
                break;
            case '"password" length must be at least 6 characters long':
                errorMessage = '비밀번호는 6자리 이상이어야 합니다.';
                break;
            case '"title" is required':
                errorMessage = '제목을 입력해 주세요.';
                break;
            case '"content" is required':
                errorMessage = '자개소개를 입력해 주세요.';
                break;
            case '"content" length must be at least 150 characters long':
                errorMessage = '자기소개는 150자 이상 작성해야 합니다.';
                break;
            default:
                errorMessage = '에러';
        }
        return res.status(400).json({
            status: 400,
            errorMessage,
        });
    }

    return res.status(500).json({
      status: 500,
      message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
    });
  };
